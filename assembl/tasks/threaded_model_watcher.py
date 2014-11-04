from threading import Thread
from Queue import Queue

from zope import interface
from pyramid.path import DottedNameResolver

from ..lib.model_watcher import IModelEventWatcher

"""The ModelEventWatcher are Mapper-level flush events, so they cannot create objects.
This pushes the logic on another thread, as a simpler alternative to celery,
so we're already using another per-thread session."""


class ThreadDispatcher(Thread):
    singleton = None
    daemon = True
    mw_class = None

    @classmethod
    def get_instance(cls):
        if not cls.singleton:
            cls.singleton = cls()
            cls.singleton.start()
        return cls.singleton

    def __init__(self):
        super(ThreadDispatcher, self).__init__()
        self.queue = Queue()
        self.dying = False
        self.mw = self.mw_class()

    def run(self):
        while not self.dying:
            print "*"*20,
            event = self.queue.get()
            print event
            method_name = event[0]
            method = getattr(self.mw, method_name)
            method(*event[1:])

    @classmethod
    def start_dispatcher(cls):
        cls.get_instance()


class ThreadedModelEventWatcher(object):
    interface.implements(IModelEventWatcher)

    def __init__(self):
        self.queue = ThreadDispatcher.get_instance().queue

    def processPostCreated(self, id):
        self.queue.put(('processPostCreated', id))

    def processIdeaCreated(self, id):
        self.queue.put(('processIdeaCreated', id))

    def processIdeaModified(self, id, version):
        self.queue.put(('processIdeaModified', id, version))

    def processIdeaDeleted(self, id):
        self.queue.put(('processIdeaDeleted', id))

    def processExtractCreated(self, id):
        self.queue.put(('processExtractCreated', id))

    def processExtractModified(self, id, version):
        self.queue.put(('processExtractModified', id, version))

    def processExtractDeleted(self, id):
        self.queue.put(('processExtractDeleted', id))

    def processAccountCreated(self, id):
        self.queue.put(('processAccountCreated', id))

    def processAccountModified(self, id):
        self.queue.put(('processAccountModified', id))


def includeme(config):
    resolver = DottedNameResolver(__package__)
    class_name = config.get_settings().get('assembl.threadedmodelwatcher')
    ThreadDispatcher.mw_class = resolver.resolve(class_name)
